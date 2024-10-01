function generateSecureId() {
    const randomPart = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    const timestamp = Date.now().toString(16);
    return `${timestamp}-${randomPart}`;
}

export default generateSecureId