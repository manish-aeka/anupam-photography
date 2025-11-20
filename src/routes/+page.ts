// export async function load({fetch}) {
//   const res = await fetch("/api/photography");
//   const data = await res.json();

//   return { sections: data }
// }
export async function load({ fetch }) {
  const response = await fetch("/api/photography");
  const data = await response.json();
  return { sections: data }; // your API returns array
}
