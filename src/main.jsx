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
} from './routes/root';
import Contact,{
  loader as contactLoader
} from './routes/contact'
import ErrorPage from './error-page';
import EditContact, {
  action as editAction
} from './routes/edit';

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
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: editAction
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
