"use client";

import React, { useState } from "react";
import styles from "./Contact.module.css";
import Magnetic from "../ui/Magnetic";
import { Send, Mail, Phone } from "lucide-react";

/* Inline SVG brand icons */
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Contact Details */}
          <div className={styles.infoCol}>
            <span className={styles.tag}>Get in Touch</span>
            <h2 className={styles.title}>
              LET&apos;S BUILD <br />
              <span className="gradient-text">SOMETHING GREAT</span>
            </h2>
            <p className={styles.subtitle}>
              Whether you have a role that fits my skill set, want to discuss a project,
              or simply want to connect — I&apos;d love to hear from you.
            </p>

            <div className={styles.contactInfo}>
              <a href="mailto:dssanuthmandepa@gmail.com" className={styles.contactRow} data-hover>
                <Mail size={18} />
                <span>dssanuthmandepa@gmail.com</span>
              </a>
              <a href="tel:+94760874718" className={styles.contactRow} data-hover>
                <Phone size={18} />
                <span>+94 760 874 718</span>
              </a>
            </div>

            <div className={styles.socials}>
              <Magnetic>
                <a
                  href="https://github.com/SanuthMandepa"
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.socialIcon} glass`}
                >
                  <GithubIcon />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="https://linkedin.com/in/sanuthmandepa"
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.socialIcon} glass`}
                >
                  <LinkedinIcon />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="mailto:dssanuthmandepa@gmail.com"
                  className={`${styles.socialIcon} glass`}
                >
                  <Mail size={20} />
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Form Box */}
          <div className={styles.formCol}>
            <form onSubmit={handleSubmit} className={`${styles.form} glass`}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Your Email"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Message</label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project or opportunity..."
                  className={styles.textarea}
                  required
                />
              </div>

              <Magnetic>
                <button type="submit" className={styles.submitBtn}>
                  {submitted ? "Message Sent!" : "Send Message"}
                  {!submitted && <Send size={15} className={styles.sendIcon} />}
                </button>
              </Magnetic>
            </form>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Sanuth Mandepa. All rights reserved.</p>
        </footer>
      </div>
    </section>
  );
}
