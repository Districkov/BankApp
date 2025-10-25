export function formatCardNumber(value){
  const digits = value.replace(/\D/g,'').slice(0,16);
  return digits.replace(/(.{4})/g,'$1 ').trim();
}
export function plainCardNumber(value){
  return value.replace(/\D/g,'').slice(0,16);
}
export function formatPhone(value){
  const digits = value.replace(/\D/g,'').slice(0,11);
  // ensure starts with 7 if user typed 8 convert to 7
  let d = digits;
  if(d.startsWith('8')) d = '7' + d.slice(1);
  if(!d.startsWith('7') && d.length>0) d = '7' + d;
  let res = d;
  if(res.length<=1) return '+'+res;
  if(res.length<=4) return '+'+res[0]+' ('+res.slice(1)+'';
  if(res.length<=7) return '+'+res[0]+' ('+res.slice(1,4)+') '+res.slice(4);
  if(res.length<=9) return '+'+res[0]+' ('+res.slice(1,4)+') '+res.slice(4,7)+'-'+res.slice(7);
  return '+'+res[0]+' ('+res.slice(1,4)+') '+res.slice(4,7)+'-'+res.slice(7,9)+'-'+res.slice(9,11);
}
export function plainPhone(value){
  return value.replace(/\D/g,'');
}
export function validateCardNumber(value){
  return plainCardNumber(value).length===16;
}
export function validatePhone(value){
  const p = plainPhone(value);
  return (p.length===11) && (p.startsWith('7') || p.startsWith('8'));
}
export function validateAmount(value){
  if(!value) return false;
  const v = value.toString().replace(',','.');
  const num = parseFloat(v);
  return !isNaN(num) && num>0;
}