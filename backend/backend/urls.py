from django.urls import path, include
from django.http import JsonResponse


def root(_request):
    return JsonResponse({"ok": True, "message": "Msgboard API running. See /api/comments/."})


urlpatterns = [
    path("", root, name="root"),
    path("api/comments/", include("comments.urls")),
]
