import { useState } from "react";
import Todo from "./components/Todo/Todo";
import Layout from './components/Layout/Layout'

function App() {
  const [count, setCount] = useState(0);

  return (
    <Layout>
      <Todo />
    </Layout>
  );
}

export default App;
