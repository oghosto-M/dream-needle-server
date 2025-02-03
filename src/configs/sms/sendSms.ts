require("dotenv").config();

const data = ({ phone, code } : {phone : string , code : string}) =>
  JSON.stringify({
    mobile: `${phone}`,
    templateId: 950170,
    parameters: [
      {
        name: "Code",
        value: `${code}`,
      },
    ],
  });

export const configs = ({phone , code} : {phone : string , code : string}) => {
  return {
    method: "post",
    url: "https://api.sms.ir/v1/send/verify",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/plain",
      "x-api-key": `${process.env.SMS_KEY}`,
    },
    data: data({phone , code}),
  };
};

