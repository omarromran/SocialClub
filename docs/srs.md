# Software Requirements Specification

## Functional requirements

- **FR-001** The system shall allow a user to register with a unique username and email address.
- **FR-002** The system shall authenticate registered users using securely hashed passwords.
- **FR-003** The system shall allow users to view and customize their profiles.
- **FR-004** The system shall allow users to create and share text, image, video, and link content.
- **FR-005** The system shall allow users to follow other users or send and respond to friend requests.
- **FR-006** The system shall allow authorized users to like, comment on, and share posts.
- **FR-007** The system shall allow users to configure privacy controls for personal information and posts.
- **FR-008** The system shall support private messaging between authorized users. *(Later phase.)*
- **FR-009** The system shall generate personalized news feeds and notifications. *(Later phase.)*
- **FR-010** The system shall allow administrators to manage users and moderate content. *(Later phase.)*
- **FR-011** The system shall allow administrators to control selected features and view engagement reports. *(Later phase.)*

## Non-functional requirements

- **NFR-001 Security:** Passwords shall never be stored in plaintext; database operations shall use PDO prepared statements; output shall be escaped; state-changing requests shall use CSRF protection; and authorization shall be checked server-side.
- **NFR-002 Security:** Sessions shall use secure settings appropriate to the deployment environment.
- **NFR-003 Usability:** The interface shall use clear navigation and provide meaningful feedback for user actions.
- **NFR-004 Accessibility:** Pages shall use semantic HTML, labels, readable contrast, and keyboard-accessible controls.
- **NFR-005 Maintainability:** Configuration, reusable components, public assets, SQL, and documentation shall remain separated.
- **NFR-006 Reliability:** Database failures shall be handled safely without exposing credentials or internal error details.
- **NFR-007 Performance:** Common pages shall avoid unnecessary database queries and use appropriate indexes.

## Assumptions and constraints

The initial environment is XAMPP-compatible PHP and MySQL/MariaDB. The project uses no framework or package manager. Users have a modern browser and an internet connection only if deployment later requires one. Media validation, storage limits, and content moderation policies will be specified before their features are implemented.
