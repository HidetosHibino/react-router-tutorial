import { 
  Form,
  useLoaderData,
  useFetcher,
} from "react-router-dom";
import { getContact, updateContact } from "../contacts";
// contactId URL セグメントに注目してください。コロン（:）には特別な意味があり、「ダイナミックセグメント」になります。
// ダイナミックセグメントは、コンタクトIDのように、URLのその位置にあるダイナミックな（変化する）値にマッチします。
// このようなURLの値を「URL Params」、または単に「params」と呼びます。

// これらのパラメータは、動的なセグメントに一致するキーでloaderに渡されます。
// たとえば、このセグメントは :contactId という名前なので、値は params.contactId として渡されます。
export async function loader({params}){
  const contact = await getContact(params.contactId);
  return { contact };
}

export async function action({request, params}){
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") ==="true"
  })
}

export default function Contact() {
  const { contact } = useLoaderData();

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || null}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            // Note the action points to "destroy". Like <Link to>, <Form action> can take a relative value.
            // Since the form is rendered in contact/:contactId, then a relative action with destroy will submit the form to contact/:contactId/destroy when clicked.
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

// これまでのミューテーション（データを変更すること）では、履歴スタックに新しいエントリーを作成し、ナビゲートするフォームを使用してきました。
// このようなユーザーフローはよくあることですが、ナビゲーションを行わずにデータを変更したい場合も同じようによくあります。
// このような場合、useFetcherフックがあります。これによって、ナビゲーションを起こさずにローダーやアクションと通信することができます。