<?php

include "db_connection.php";

$username = $_GET["Userlogin"];
$password = $_GET["Passlogin"];
$passhash = password_hash($password, PASSWORD_DEFAULT);

$sql = "SELECT * FROM User WHERE Username = '$username'";
$result = $conn -> query($sql) or die (mysqli_error($conn));


if($username == "" or $password == ""){
 echo "<script>alert('Please ensure there are no blank fields!');document.location='login.php'</script>";
 exit;
} 


if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
      if (password_verify($password, $row["PasswordHash"])){
          echo "<script>alert('Login Success');document.location='./index.html'</script>";
      }
      else {

         echo "<script>alert('Login is incorrect');document.location='login.php'</script>";
         exit;

         echo "Unsuccessful login";
      }
    }
}
else {

    echo "<script>alert('Login is incorrect');document.location='login.php'</script>";
    exit;
}

?>

<br>
<br>
<a href="login.html">
      <button>Go back</button>
</a>