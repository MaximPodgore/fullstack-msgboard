import json
from typing import Optional

from django.http import JsonResponse, HttpRequest, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone

from .models import Comment


def _parse_json(request: HttpRequest) -> dict:
    try:
        return json.loads(request.body.decode("utf-8")) if request.body else {}
    except Exception:
        return {}


@csrf_exempt
def list_comments(request: HttpRequest):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])
    qs = Comment.objects.order_by("-date")
    data = [c.as_dict() for c in qs]
    return JsonResponse({"comments": data})


# No manual id assignment; Postgres auto-increments via identity/sequence.


@csrf_exempt
@transaction.atomic
def add_comment(request: HttpRequest):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    payload = _parse_json(request)
    text = (payload.get("text") or "").strip()
    if not text:
        return JsonResponse({"error": "Missing 'text'"}, status=400)

    now = timezone.now()
    c = Comment(
        author="Admin",
        text=text,
        date=now,
        likes=0,
        image=None,
    )
    c.save(force_insert=True)
    return JsonResponse({"comment": c.as_dict()}, status=201)


@csrf_exempt
@transaction.atomic
def edit_comment(request: HttpRequest, comment_id: int):
    if request.method not in ("PUT", "PATCH"):
        return HttpResponseNotAllowed(["PUT", "PATCH"])
    payload = _parse_json(request)
    text = payload.get("text")
    if text is None:
        return JsonResponse({"error": "Missing 'text'"}, status=400)

    try:
        c = Comment.objects.get(id=comment_id)
    except Comment.DoesNotExist:
        return JsonResponse({"error": "Comment not found"}, status=404)

    c.text = str(text)
    c.save(update_fields=["text"])
    return JsonResponse({"comment": c.as_dict()})


@csrf_exempt
@transaction.atomic
def delete_comment(request: HttpRequest, comment_id: int):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])
    deleted, _ = Comment.objects.filter(id=comment_id).delete()
    if not deleted:
        return JsonResponse({"error": "Comment not found"}, status=404)
    return JsonResponse({"deleted": True})
