export default async function generateNumericReferenceNumber(email) {
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashNumeric = hashArray.map(b => b.toString().padStart(3, '0')).join('');
    return hashNumeric.slice(0, 10);
}