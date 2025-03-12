import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../../enviroments/enviroment';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData = { name: '', email: '', message: '' };
  loading = false;
  message = '';
  success !: boolean;

  sendEmail() {
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      this.message = "All fields are required!";
      console.log(this.formData.name,this.formData.email,this.formData.message);
      
      return;
    }

    this.loading = true;
    const templateParams = {
      from_name: this.formData.name,
      from_email: this.formData.email,
      message: this.formData.message
    };

    emailjs.send(environment.emailjs.SERVICE_ID, environment.emailjs.TEMPLATE_ID, templateParams, environment.emailjs.emailJsPublicKey)
      .then(() => {
        this.success = true
        this.message = "Message sent successfully!";
        this.formData = { name: '', email: '', message: '' };
      })
      .catch(() => {
        this.success = false
        this.message = "Failed to send message. Try again.";

      })
      .finally(() => {
        this.loading = false;
      });
  }
}
