# Enums

Examples of enums in Sway

```sway
contract;

// Enums
// - Basics
// - Enums of structs
// - Enum of enums

enum Color {
    Red: (),
    Blue: (),
    Green: (),
}

// Enums of structs
struct Point {
    x: u64,
    y: u64,
}

enum Shape {
    Circle: (Point, u64),
    Triangle: [Point; 3],
}

// Enum of enums
enum Error {
    Auth: AuthError,
    Transfer: TransferError,
}

enum AuthError {
    NotOwner: (),
    NotApproved: (),
}

enum TransferError {
    TransferToZeroAddress: (),
    InsufficientBalance: (),
}

abi MyContract {
    fn test_func() -> Error;
}

impl MyContract for Contract {
    fn test_func() -> Error {
        let color = Color::Blue;

        let circle = Shape::Circle((Point { x: 0, y: 0 }, 1));
        let triangle = Shape::Triangle([
            Point { x: 0, y: 0 },
            Point { x: 1, y: 1 },
            Point { x: 2, y: 0 },
        ]);

        let error = Error::Auth(AuthError::NotOwner);

        error
    }
}
```
