import { Button } from '@amplify-monorepo/ui';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '@amplify-monorepo/backend';
import { useEffect, useState } from 'react';
import outputs from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';

Amplify.configure(outputs);

const graphQLClient = generateClient<Schema>({ authMode: 'userPool' });
console.log(graphQLClient.models.Todo);
export function App() {
  return (
    <Authenticator className="mt-12 p-8">
      {({ signOut, user }) => (
        <div>
          <h1>This is blog-web-app website</h1>
          <div>
            <h2>User Info</h2>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
          <Button onClick={signOut}>Sign out</Button>
          <Todos />
        </div>
      )}
    </Authenticator>
  );
}

function Todos() {
  const [todos, setTodos] = useState<Schema['Todo']['type'][]>([]);

  useEffect(() => {
    graphQLClient.models.Todo.list().then(({ data: todos }) => {
      setTodos(todos);
    });
  }, []);

  return (
    <div className="mt-12 flex flex-col">
      {todos.map((todo) => (
        <div key={todo.id}>
          <h3>{todo.content}</h3>
        </div>
      ))}
      <input className="p-4 border" type="text" id="content" />
      <Button
        onClick={async () => {
          const content = (
            document.getElementById('content') as HTMLInputElement
          ).value;
          await graphQLClient.models.Todo.create({ content });
          const { data: todos } = await graphQLClient.models.Todo.list();
          setTodos(todos);
        }}
      >
        Add todo
      </Button>
    </div>
  );
}
