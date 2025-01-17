<a alt="Nx logo" href="https://this-film-finder.vercel.app" target="_blank" rel="noreferrer"><img src="apps/this-film-finder/src/assets/broken-egg.svg"  width="45"><img src="apps/this-film-finder/src/assets/egg.svg"  width="45"><img src="apps/this-film-finder/src/assets/chicken.svg"  width="45"></a>

# 🔸 ThisFilmFinder 🔸 

✨ **This workspace has been generated by [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨

At first, I wanted to make two apps: one with Angular and another as a CLI, to demonstrate my Node skills too. That's why I thought using a monorepo would be smart. But I clearly didn't have time to do both ⏳. So, I decided to put all my effort into the Angular app.

## 🔸 🔧 Start & build the application for production

I have created two scripts in the package.json to start and build the app:
- Run `npm run start:this-film-finder` to start the development server.
- Run `npm run build:this-film-finder` to build the application.
  - The build artifacts are stored in the output directory (e.g. `dist/apps/this-film-finder/browser`)

## 🔸 🌐 Deployed version

I have used Vercel to deploy the application. It deploys automatically whenever main is updated. 

URL: https://this-film-finder.vercel.app

This is the first time I've used something like this. I initially tried Netlify, but after a few hours of errors, I found out [it doesn't support NX Angular apps](https://answers.netlify.com/t/nx-angular-could-not-locate-your-angular-json/113051
).

I didn't know any other alternatives, so I asked ✨ChatGPT✨ and it pointed me to Vercel. It was super easy, and I had it working in minutes.

## 🔸 🎆 What can This Film Finder do?

- **APP_INITIALIZER: healthcheck** → Redirect to /api-not-contentful if not contentful
- 🔒 Save **encrypted** token and theme in **local/session storage**, and retrieve and **decrypt** them for autologin
   - **APP_INITIALIZER:** Check if there is auth data persisted in local/session storage, and set it in the auth store if there is any
- The logo in the header works like a *logout* button. It clears the token and the selected theme from the local/session storage.
- Safely store filtering information in URL query parameters to share the exact same search with others
- Store the entry URL in auth storage to redirect after login
- Guards to check if healthcheck is settled & to check whether the token is set in state
- 🔁 **Recursive fetches** to obtain the **total number of movies** after filtering & **getting all the available genres**
  - *It actually took me a while to discover that if I did a filtered search with limit=1, I would obtain the total number of videos for that specific filtered search 🤦. But I did discover it! So I have edited my recursive fetching to obtain the total number of videos in each search.*
- Use of `@defer` to only load the posters when they are in the viewport → I just wanted to use `@defer` somewhere since it is a cool quite new option we got with Angular 17. I am aware that I could have used the `<ion-img></ion-img>`, which have implemented a lazy load of the image. But `@defer` would be unnecessary with `<ion-img></ion-img>`
- Pagination component to move one by one or directly change page and page size from inputs

## 🔸 🔝 Most valuable features

**Auth feature**

I really enjoyed creating all the logic behind the auth feature, including the redirection system, ensuring that users do not lose their current search.

**Filtering by query parameters**

Storing the filters in the query parameters allows the search to be preserved when the URL is shared.

## 🔸 ➕ I would like to improve...

- I am currently working on adding an appshel to the app. I will try to work on it tomorrow evening and I will probably push it. → Did not work out. I did push everything to branch 23. I am not sure why it is not working, it may be because I created a zoneless app. I definitely would like to look at it with more detail and try to find a solution. 
- ⚠️ There are 5 vulnerabilities (3 low, 1 moderate, 1 high) that I should address.
- The ion-icons are not visible on safari.
- My initial idea was to create a page with ion-tabs based on genres and navigate through them. I kept it simpler to meet the deadline. 
- I would like to create a history 📝 of the filters used in a session.
- Find a way to count the films by genres after filtering by search, and limit the selector values to only genres that have films meeting the search filter.
- Add an extra parameter to the query parameters to determine whether the film-detail modal is opened, so that if the URL is shared, it will open the modal as well. Maybe using a named router outlet

