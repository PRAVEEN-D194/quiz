

export default function Footer(){
    return(<>
        <footer className="footer">
        <p>🎯 Create Quizzes • Challenge Friends • Earn Points</p>

        {/* <div className="footer-contact">
            <p>📧 Email: praveen@example.com</p>
            <p>📱 Phone: +91 XXXXX XXXXX</p>
            <p>💻 GitHub: github.com/yourusername</p>
            <p>🔗 LinkedIn: linkedin.com/in/yourusername</p>
        </div> */}
        <p>© {new Date().getFullYear()} Quiz Arena.</p>
        </footer>
    </>)
}