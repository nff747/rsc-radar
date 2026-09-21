export default async function Page() {
  const dynamicModule = await import('./dynamic-module');
  return <div/>;
}