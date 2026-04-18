### Git Repo
1. Easiest way to clone a branch

```
git clone <repo_name>
cd to folder
git status
git checkout <branch_name>
```
### Virtual Env 
```
cd backend
python -m venv .venv
pip install -r requirements.txt
create .env (if needed)
```

### Push to Repo
```
git status
git add .
git commit -m "message"
git push
```

### Daily 
To update any recent changes from main in case changes were merged

```
git pull origin main
```

### Git Pull Request
1. In Git Hub, create a Pull Request 
2. Enter descripton of your pull requet
3. Tag somebody to review