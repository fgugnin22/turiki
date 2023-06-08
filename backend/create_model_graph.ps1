Set-Location "C:\Users\fgugn\projects\proh\backend"
venv/Scripts/activate
py manage.py graph_models -a > models.dot
dot -Tsvg models.dot > models.svg