import { it, test, expect, describe} from "vitest"
import { screen, render, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom/vitest";
import { convert } from "../../libs/currency";
import App from "../App";

// can use test instead of it
// it("should be 2", function() {
//     expect(1 + 1).toBe(2);
// });

describe("Libs Test", function() {
    it("should be 4005.2", function() {
        expect(convert(1)).toBe(4005.2);
    });
    
    it("should be 6007.8", function() {
        expect(convert(1.5)).toBe(6007.8);
    });
});

describe("UI Test", function() {
    render(<App />);

    it("should render the app", () => {
        expect(screen.getByRole("title")).toBeInTheDocument();
    });

    it("should show correct result", async() => {
        await fireEvent.change(screen.getByRole("input"), {
            target: { value: "1.5" }
        });

        await fireEvent.click(screen.getByRole("button"));

        expect(screen.getByRole("result")).toHaveTextContent("6007.8");
    });
})