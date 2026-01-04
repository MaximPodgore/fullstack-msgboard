from django.urls import path
from .views import list_comments, add_comment, edit_comment, delete_comment

urlpatterns = [
    path("", list_comments, name="comments-list"),
    path("add", add_comment, name="comments-add"),
    path("<int:comment_id>/edit", edit_comment, name="comments-edit"),
    path("<int:comment_id>/delete", delete_comment, name="comments-delete"),
]
