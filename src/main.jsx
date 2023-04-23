import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

// load時に実行する関をimport
// <Form> prevents the browser from sending the request to the server and sends it to your route action instead
import Root,{
  loader as rootLoader,
  action as rootAction,
  action,
} from './routes/root';
import Contact,{
  loader as contactLoader,
  action as contactAction,
} from './routes/contact'
import ErrorPage from './error-page';
import EditContact, {
  action as editAction
} from './routes/edit';
import { action as destroyAction } from './routes/destroy';
import Index from './routes';

const router = createBrowserRouter([
  {
    path: "/",
    element:<Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    // In web semantics, a POST usually means some data is changing. 
    // By convention, React Router uses this as a hint to automatically revalidate the data on the page after the action finishes. 
    // That means all of your useLoaderData hooks update and the UI stays in sync with your data automatically! Pretty cool.
    action: rootAction,
    children: [
      // Note the { index:true } instead of { path: "" }.
      // That tells the router to match and render this route when the user is at the parent route's exact path, so there are no other child routes to render in the <Outlet>.
      { index: true, element: <Index />},
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
        action: contactAction
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: editAction
      },
      {
        path: "contacts/:contactId/destroy",
        action: destroyAction,
        // Because the destroy route has its own errorElement and is a child of the root route, 
        // the error will render there instead of the root. As you probably noticed, 
        // these errors bubble up to the nearest errorElement. 
        // Add as many or as few as you like, as long as you've got one at the root.
        // 子供にerrorElementをしていないと親に吸われる
        errorElement: <div>Oops! There was an error.</div>,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* This first route is what we often call the "root route" 
    since the rest of our routes will render inside of it. 
    It will serve as the root layout of the UI, 
    we'll have nested layouts as we get farther along. */}
  </React.StrictMode>,
)
