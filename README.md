# NutriVeda

Ayurvedic diet-planning app: a React (Create React App) frontend plus an Express API,
deployed together on Vercel. The API runs as a single serverless function
(`api/index.js` → `server/app.js`) and stores data in Firestore; diet plans are
generated with Google Gemini.

## Project layout

- `src/` - React frontend
- `server/` - Express API (routes, controllers, Firestore models, PDF service, sample CSV data)
- `api/index.js` - Vercel function that serves the Express app for every `/api/*` request
- `vercel.json` - rewrites `/api/*` to the function and everything else to the SPA

## Environment variables

Copy `.env.example` to `.env` for local development. On Vercel, add the same
variables under Project Settings > Environment Variables:

| Variable | Required | Notes |
| --- | --- | --- |
| `FIREBASE_PROJECT_ID` | yes | From the Firebase service-account JSON |
| `FIREBASE_CLIENT_EMAIL` | yes | From the Firebase service-account JSON |
| `FIREBASE_PRIVATE_KEY` | yes | The `private_key` value, with `
` line breaks |
| `GEMINI_API_KEY` | yes | Google AI Studio key |
| `GEMINI_MODEL` | no | Defaults to `gemini-flash-latest` |
| `JWT_SECRET` | no | Only for the `/api/v1/auth` endpoints |
| `REACT_APP_API_URL` | no | Leave unset; the frontend calls `/api` on the same origin |

`GET /api/health` reports which required variables are missing.

Never commit `.env` or service-account keys.

## Local development

```bash
npm install
npm run server   # API on http://localhost:5000
npm start        # frontend on http://localhost:3000, proxies /api to the API
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
