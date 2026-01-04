from django.db import models


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    author = models.TextField()
    text = models.TextField()
    date = models.DateTimeField(db_column="date")
    likes = models.IntegerField()
    image = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "comments"

    def as_dict(self):
        return {
            "id": self.id,
            "author": self.author,
            "text": self.text,
            "date": self.date.isoformat().replace("+00:00", "Z"),
            "likes": self.likes,
            "image": self.image or "",
        }
