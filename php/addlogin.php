<?php

include "db_connection.php";

$username = $_GET["username"];
$email = $_GET["email"];
$fname = $_GET["fname"];
$lname = $_GET["lname"];
$dob = $_GET["dob"];
$pass = $_GET["pass"];
$passhash = password_hash($pass, PASSWORD_DEFAULT);

$sql = "SELECT * FROM User WHERE Username = '$username'";
$result = $conn -> query($sql) or die (mysqli_error($conn));


if ($result -> num_rows > 0) {
  echo "<script>alert('The username ". $username . " is taken' );document.location='signuppage.html'</script>";
  exit;

}

$sql = "SELECT * FROM User WHERE Email = '$email'";
$result = $conn -> query($sql) or die (mysqli_error($conn));

if ($result -> num_rows > 0) {
  echo "<script>alert('The email ". $email . " is already registered' );document.location='signuppage.html'</script>";
  exit;

}

if ($result -> num_rows > 0) {
      echo "The username " . $username . " is taken";
      exit;

}
$sql = "INSERT INTO User (Username, Email, Firstname,Surname,DOB,PasswordHash)
VALUES ('$username' , '$email', '$fname', '$lname', '$dob', '$passhash')";

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

?>