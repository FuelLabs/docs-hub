use fuels_macros::setup_program_test;

setup_program_test!(Deploy(
    name = "some_instance",
    contract = "SomeUnknownContract",
    wallet = "some_wallet"
));

fn main() {}
