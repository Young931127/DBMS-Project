import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("切換到一般任務標籤時顯示一般任務列表", () => {
  render(<App />);

  // 確認預設顯示置頂任務
  expect(screen.getByText("任務1")).toBeInTheDocument();
  expect(screen.getByText("任務2")).toBeInTheDocument();

  // 點擊切換到一般任務
  fireEvent.click(screen.getByText("一般任務"));

  // 確認顯示一般任務
  expect(screen.getByText("任務3")).toBeInTheDocument();
  expect(screen.getByText("任務4")).toBeInTheDocument();
});

test("點擊任務時顯示警告框", () => {
  render(<App />);

  // 模擬點擊任務
  const task = screen.getByText("任務1");
  window.alert = jest.fn(); // 模擬 alert 函數
  fireEvent.click(task);

  // 確認 alert 被呼叫
  expect(window.alert).toHaveBeenCalledWith("click : 任務1");
});
