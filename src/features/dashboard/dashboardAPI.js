export async function fetchUsers() {
  const data = await fetch(
    'https://my-json-server.typicode.com/karolkproexe/jsonplaceholderdb/data'
  )
    .then((response) => response.json())
    .then((data) => data);
  return data;
}
