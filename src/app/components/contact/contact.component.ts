import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  loading = false;
  statusMessage = '';  
  success!: boolean;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  sendEmail() {
    if (this.contactForm.invalid) return;
  
    this.loading = true;
  
    const templateParams = {
      from_name: this.contactForm.value.name,
      from_email: this.contactForm.value.email,  // User's email
      message: this.contactForm.value.message
    };
  
    emailjs.send(environment.emailjs.SERVICE_ID, environment.emailjs.TEMPLATE_ID, templateParams, environment.emailjs.emailJsPublicKey)
      .then(() => {
        this.success = true;
        this.statusMessage = "Message sent successfully!";
        this.contactForm.reset();
      })
      .catch(() => {
        this.success = false;
        this.statusMessage = "Failed to send message. Try again.";
      })
      .finally(() => {
        this.loading = false;
      });
  }
  }
