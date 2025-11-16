import { useEffect, useState } from "react";

function HomePage() {
  const [data, setData] = useState({ theloai: [], libary: [], user: null });

  useEffect(() => {
    fetch("http://localhost:5000/test", {
      credentials: "include", // nếu dùng cookie JWT
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
      });
  }, []);

  return (
    <div id="main">
      <header>
        <nav>
          <ul>
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li>
              <span>Thể loại</span>
              <ul>
                {data.theloai.map((item) => (
                  <li key={item._id}>{item.theloai}</li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>

        <div className="user-section">
          {data.user ? (
            <div>
              Xin chào, {data.user.username}
              <form method="post" action="/logout">
                <button>Đăng xuất</button>
              </form>
            </div>
          ) : (
            <a href="/login">Đăng nhập</a>
          )}
        </div>
      </header>

      <main>
        {/* render libary ở đây */}
        {data.libary.map((book) => (
          <div key={book._id}>{book.title}</div>
        ))}
      </main>
    </div>
  );
}

export default HomePage;
