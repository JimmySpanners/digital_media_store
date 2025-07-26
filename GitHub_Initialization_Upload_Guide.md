To initialize a project in VSCode and upload it to a new GitHub repository on the main branch, here’s a clean step-by-step workflow:

1. Precursor:
echo "# fluxedita_custom_landing_page_package" >> README.md

2. Initialize Your Project Locally after you have run the cmd above!
Open your project folder in VSCode and run the following in the terminal:
git init
This initializes a new Git repository in your project directory.

3. Create a .gitignore File (basic .gitignore already inclded, amend as you wish)
Add a .gitignore file to exclude files you don’t want in version control (e.g., node_modules, .env, etc.). You can use templates from gitignore.io for your tech stack.

4. Stage and Commit Your Files
git add .

5.  Commit your files
git commit -m "Initial commit"

6. Create a New GitHub Repository
Go to GitHub and create a new repository named digital_media_store at https://github.com/JimmySpanners/digital_media_store. Do not initialize it with a README or .gitignore, these are included in your Fluxedita Package (amend as required locally).

7. Link Your Local Repo to GitHub
Use your actual GitHub repository URL:

git remote add origin https://github.com/JimmySpanners/digital_media_store.git

**If you need to update your remote to a different repository, use these commands:**

# Check your current remote URL

git remote -v

# If the remote is incorrect, change it with:
git remote set-url origin https://github.com/JimmySpanners/digital_media_store.git

# If you see 'remote origin already exists', use this instead:
git remote set-url origin https://github.com/JimmySpanners/digital_media_store.git

# Now push to the main branch

git push -u origin main

> **Troubleshooting:**
> If you see `Repository not found.`, make sure:
> - The repository URL is correct (no typos, matches your GitHub repo exactly).
> - The repository exists on GitHub (create it at https://github.com/JimmySpanners/digital_media_store if it does not exist).
> - You are logged in and have permission to push to the repository.

8. Push to the main Branch
git push -u origin main

Ensure your local branch is named main (or rename it if needed):

echo "# digital_media_store" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/JimmySpanners/digital_media_store.git
git push -u origin main

🧠 Bonus Tips
If you have made changes, and wish to update your existing repo, please follow these steps:

git status
git add .
git commit -m "Push latest changes"
git push origin main