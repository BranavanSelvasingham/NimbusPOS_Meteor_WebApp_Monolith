var _sendEmail = function (to, from, subject, text, html) {
    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text,
      html: html
    });
};

Maestro.Notifications.Email.Send = _sendEmail;
