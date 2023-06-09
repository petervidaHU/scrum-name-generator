export const post = (data: unknown) => {
  let JSONdata;
  
  try {
    JSONdata = JSON.stringify(data);
  } catch (e) {
    throw new Error(`Error in stringifying json -- ${e}`)
  }

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata,
  };
}