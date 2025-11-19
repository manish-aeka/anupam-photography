export async function load({fetch}) {
  const res = await fetch("/api/photography");
  const data = await res.json();

  return { sections: data }
}
