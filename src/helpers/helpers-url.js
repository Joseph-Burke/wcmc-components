export const isALink = (string) => {
  if(string.includes('http')){
    return `<a href="${string}" title="Visit ${string}" target="_blank" />${string}</a>`
  } else {
    return string
  }
}