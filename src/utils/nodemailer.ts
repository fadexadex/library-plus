import nodemailer from "nodemailer";
import { AdminRepository } from "../modules/admin/repository";

const adminRepo = new AdminRepository();

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.HOST_EMAIL_ADDRESS,
        pass: process.env.HOST_EMAIL_PASSWORD,
      },
    });
  }

  async sendMail(to: string | string[], subject: string, text?: string, html?: string) {
    const mailOptions = {
      from: `Library System <${process.env.HOST_EMAIL_ADDRESS}>`,
      to,
      subject,
      text: text || "",
      html: html || "",
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ message: "Mail sent", email: to });
        }
      });
    });
  }

  async notifyAdminsAboutBorrowRequest(bookTitle: string, requestLink: string) {
    const admins = await adminRepo.findAdmins();

    if (!admins.length) {
      console.log("No admins found to notify.");
      return;
    }

    const subject = "New Borrow Request Notification";
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">New Borrow Request Notification</h2>
        <p>Dear Admin,</p>
        <p>A new borrow request has been made for the book titled <strong>${bookTitle}</strong>.</p>
        <p>Please review the request by clicking the link below:</p>
        <p>
          <a href="${requestLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
            Review Borrow Request
          </a>
        </p>
        <p>If the button above does not work, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all;">${requestLink}</p>
        <p>Thank you for your attention.</p>
        <p>Best regards,</p>
        <p><strong>Library System</strong></p>
      </div>
    `;

    const emailPromises = admins.map((admin) =>
      this.sendMail(admin.email, subject, undefined, html)
    );

    return Promise.all(emailPromises);
  }

  async notifyUserAboutBorrowRequestStatus(
    userEmail: string,
    bookTitle: string,
    status: string,
    requestLink: string
  ) {
    const subject = "Borrow Request Status Update";
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Borrow Request Status Update</h2>
        <p>Dear User,</p>
        <p>Your borrow request for the book titled <strong>${bookTitle}</strong> has been <strong>${status}</strong>.</p>
        <p>You can view the details of your borrow request by clicking the link below:</p>
        <p>
          <a href="${requestLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
            View Borrow Request
          </a>
        </p>
        <p>If the button above does not work, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all;">${requestLink}</p>
        <p>Thank you for using our library system.</p>
        <p>Best regards,</p>
        <p><strong>Library System</strong></p>
      </div>
    `;

    await this.sendMail(userEmail, subject, undefined, html);
  }

  async notifyAdminsAboutReturnRequest(bookTitle: string, requestLink: string) {
    const admins = await adminRepo.findAdmins();

    if (!admins.length) {
      console.log("No admins found to notify.");
      return;
    }

    const subject = "New Return Request Notification";
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">New Return Request Notification</h2>
        <p>Dear Admin,</p>
        <p>A new return request has been made for the book titled <strong>${bookTitle}</strong>.</p>
        <p>Please review the request by clicking the link below:</p>
        <p>
          <a href="${requestLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
            Review Return Request
          </a>
        </p>
        <p>If the button above does not work, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all;">${requestLink}</p>
        <p>Thank you for your attention.</p>
        <p>Best regards,</p>
        <p><strong>Library System</strong></p>
      </div>
    `;

    const emailPromises = admins.map((admin) =>
      this.sendMail(admin.email, subject, undefined, html)
    );

    return Promise.all(emailPromises);
  }
}

export default EmailService;
