import React, { Component } from "react";
import styles from "./styles.scss";

class Terms extends Component {
  render() {
    return (
      <div style={{ background: "#f8f9fa" }}>
        <div className={styles.termsContainer}>
          <div className={styles.termsMainHeader}>
            Book Buy Terms, Conditions, Tips and Tricks
          </div>
          <div className={styles.mainTextContainer}>
            <div className={styles.mainHeading}>
              Who We Are
              <hr />
            </div>
            <div className={styles.mainTextBlock}>
              BookBuy is an independently run platform designed by students at
              the University of Guelph in order to introduce a new and unique
              way of buying and selling textbooks. Book Buy instantly connects
              students from all across Ontario who are looking to buy and sell
              textbooks. Students can create a completely free account and are
              then able to act as a buyer and search through hundreds of books
              or become a seller and post their own textbooks for sale on the
              platform. Through the use of our own messaging platform, students
              are instantly able to send/receive messages about their textbooks
              with no need to share personal information such as a cell phone
              number or email with potential buyers. Students are then able to
              chat live using the site and discuss details about textbooks,
              prices and potential exchanges!
            </div>

            <div className={styles.mainHeading}>
              How it Works
              <hr />
            </div>
            <div className={styles.mainTextBlock}>
              Depending on whether you are looking to buy or sell textbooks, we
              suggest that you create a free account! You can view all postings
              without creating an account, but in order to converse with the
              seller or post your own books you must have an account.
              <ol>
                <li>
                  The first step is to create your online profile. You will need
                  to input your full name, password, and email. That’s it. Your
                  name is the name that will appear on each one of your postings
                  and will be the name that appears in our online messaging
                  platform (feel free to abbreviate your last name if you want
                  to be more anonymous). With regards to your password, we
                  recommend that you keep your password to your-self, as well as
                  regularly changing your password every few months. Your email
                  should be one that you use and check regularly because you
                  will receive an email notification when another user has
                  messaged you!
                </li>
                <li>
                  Once you have an account, you are ready to do business! As a
                  seller, you are able to post as many textbooks as you wish!
                  Buyers are able to search and browse through a huge selection
                  of hundreds of textbooks!
                </li>
                <li>
                  Once you have found the textbook you are interested in, simply
                  click the “Contact Seller” button and you will be directly
                  linked to our very own online messaging platform where you are
                  able to privately message the seller! Our terms and conditions
                  for safe textbook exchanges are listed below.
                </li>
              </ol>
            </div>

            <div className={styles.mainHeading} style={{ fontStyle: "italic" }}>
              Terms and Conditions
            </div>

            <div className={styles.mainHeading}>
              Personal Accounts
              <hr />
            </div>
            <div className={styles.mainTextBlock}>
              Book Buy requires that buyers and sellers create an account by
              inputting a name, password, and email. Personal information will
              not be copied or distributed in any form. Under the user “Profile”
              tab, users have access to personal information and can be updated
              or deleted at anytime. Personal information such as your email is
              kept private unless specified otherwise by the user. As a user,
              you are responsible for the activities that are carried out on
              your account therefore, we suggest that you keep your account
              information to yourself and aim to make your password difficult to
              guess. We also suggest that you change your password every few
              months!
            </div>

            <div className={styles.mainHeading}>
              Content
              <hr />
            </div>
            <div className={styles.mainTextBlock}>
              As a user of Book Buy, you adhere to conduct buying/selling
              operations in a respectful manner; User activity that violates any
              one of the listed violation(s), will result in immediate
              deactivation of account. Such actions include but are not limited
              to:
              <ul>
                <li>
                  Posting ads/pictures that include inappropriate pictures,
                  insulting or offensive messages.
                </li>
                <li>
                  Messages that intend to threaten, harass, mislead or
                  intimidate another user
                </li>
                <li>
                  Copy or re-distribute another user’s information/ posting
                  content
                </li>
                <li>Falsify content or mislead another user(s)</li>
                <li>
                  Post, send or distribute harmful software and/or viruses
                </li>
                <li>Post, send, or distribute spam messages to other user’s</li>
                <li>Posting ads that are not textbooks</li>
              </ul>
            </div>

            <div className={styles.mainHeading}>
              Online Messaging Service
              <hr />
            </div>
            <div className={styles.mainTextBlock}>
              In an attempt to protect personal user information such as private
              phone numbers or email addresses, BookBuy has introduced an online
              user messaging platform where users can instantly message each
              other when inquiring about a post. This practice allows you to
              effectively use the site without having to disclose personal
              information to any unknown parties. In order to ensure a safe and
              respectful environment, all BookBuy users are expected to follow
              the rules listed; deviation from set guidelines may result in
              immediate deactivation of account. Such actions include but are
              not limited to:
              <ol>
                <li>
                  Sending inappropriate messages that aim to hurt, offend,
                  threaten, harass, discriminate or mislead another user.
                </li>
                <li>
                  Sending inappropriate pictures that include hurtful or
                  discriminatory slogans/images or include sexual images of any
                  kind.
                </li>
                <li>
                  Be false or misleading to another user regarding textbook
                  specifics, price, etc.
                </li>
              </ol>
            </div>

            <div
              style={{
                fontWeight: "bold",
                fontStyle: "italic",
                textAlign: "center"
              }}
            >
              We suggest, that if you close a sale on one of your textbooks, you
              should navigate to your “profile” screen and delete the post to
              avoid further receiving further messaging about the same book!
            </div>
            <br />
            <br />

            <div className={styles.mainHeading}>
              Tips for a Safe Exchange
              <hr />
            </div>
            <div className={styles.mainTextBlock}>
              From us at Book Buy, we want to ensure that our users are taking
              the necessary steps to ensure that all internet and in-person
              exchanges are conducted in a safe and respectful way. There are a
              few tips that we suggest all of our users follow when inquiring
              about textbooks and conducting in-person textbook exchanges:
              <ol>
                <li>
                  <strong>Public Location</strong> - whether you are the buyer
                  or the seller, all users should ensure that all exchanges are
                  done in a public place and at the right time. We suggest that
                  all exchanges be done in the middle of the day on your
                  school’s campus. Popular public spots can include the
                  university centre, the athletic centre, the library or even in
                  front of the cannon! (if you’re at UofG) All of these
                  locations are in busy public areas which can help limit risk!
                </li>
                <li>
                  <strong>Bring Friend</strong> - When meeting someone for the
                  first time, you should NEVER be alone. We suggest that when
                  you schedule a time and place to meet another user/student,
                  always bring a friend or two in order to ensure a safe
                  exchange!
                </li>
                <li>
                  <strong>Know the Details</strong>acquire the necessary
                  information about the textbook and price before scheduling an
                  exchange. Confirm with the seller that the textbook is as
                  advertised along with the price! Only agree to purchase a
                  textbook(s) if you are completely satisfied with its
                  condition, price, etc. NEVER agree to e-transfer or wire a
                  seller the money before receiving the textbook. We suggest for
                  convenience purposes that you deal in cash due to the fact
                  that e-transfer payments can be cancelled by the sender.
                  Therefore, if you are open to accepting e-transfers, we
                  suggest that as a seller, you are able to accept and deposit
                  the money before exchanging a textbook.
                </li>
              </ol>
            </div>

            <div>
              Follow these tips and tricks to ensure a safe and seamless
              textbook exchange process!
              <br />
              <br />
              By using BookBuy.ca you agree to all of the previous terms,
              conditions, and rules while also granting Book Buy the ability to
              lock or disable your account automatically or have posts instantly
              removed if you are deemed to be breaking one of our terms.
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Terms;
