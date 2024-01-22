const { BASE_URL} = process.env;

const verificationLetter = (email, verificationToken) => {
    return {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
    };
}

export default verificationLetter;