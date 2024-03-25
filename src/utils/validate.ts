export const validatePhoneNumberAntd = [
    {
      required: true,
      pattern: new RegExp(/^[0-9]{10,13}$/),
      message: "Xin vui lòng nhập đúng số điện thoại!",
    },
  ]