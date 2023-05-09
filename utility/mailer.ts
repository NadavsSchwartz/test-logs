import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendEmail = async (payload: any) => {
  const response = await sgMail.send(payload);

  if (response[0].statusCode === 202) {
    return true;
  }
  return false;
};
