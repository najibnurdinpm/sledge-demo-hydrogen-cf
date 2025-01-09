export async function adjustContentSecurityPolice(header:string) {
  let newData:any = []
  let headerArray:any = header.split(';')

  headerArray.map((items:any, index:number) => index == 1 ? newData.push(`${items} https://*`) : headerArray.length - 1 == index ? newData.push(`${items} https://*`) : newData.push(items) )

  newData.push(" img-src 'self' https://* http://* data:")

  return newData.toString().replaceAll(',',';')
}