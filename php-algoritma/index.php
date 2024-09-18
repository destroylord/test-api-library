<?php

function reverseAlphabet($str) {
    // Menghilangkan angka di akhir string
    $strWithoutNumber = substr($str, 0, -1);
    
    // Membalikan karakter alphabet dalam string
    $reversedStr = strrev($strWithoutNumber);
    
    // Menggabungkan kembali dengan angka di akhir
    return $reversedStr . substr($str, -1);
}

function longestWord($sentence) {
    // Membuat array kata dari kalimat
    $words = explode(' ', $sentence);

    // Mencari kata terpanjang
    $longestWord = '';
    foreach ($words as $word) {
        if (strlen($word) > strlen($longestWord)) {
            $longestWord = $word;
        }
    }

    return $longestWord;
}

function countOccurrencesInArray($inputArray, $queryArray) {
    // Membuat array hasil untuk setiap kata dalam query
    $result = [];

    // Looping melalui setiap kata dalam query
    foreach ($queryArray as $query) {

        // Menghitung jumlah kemunculan kata dalam input array
        $count = 0;
        foreach ($inputArray as $value) {
            if ($value === $query) {
                $count++;
            }
        }

        // Menambahkan hasil ke array result
        $result[] = $count;
    }

    return $result;
}

function sumDiagonals($matrix) {
    // Mencari ukuran matriks (n x n)
    $n = count($matrix);

    // Membuat variabel untuk menyimpan jumlah diagonal utama dan kedua
    $primaryDiagonalSum = 0;
    $secondaryDiagonalSum = 0;

    // Looping melalui setiap elemen matriks
    for ($i = 0; $i < $n; $i++) {

        // Menambahkan elemen diagonal utama ke variabel primaryDiagonalSum
        $primaryDiagonalSum += $matrix[$i][$i];

        // Menambahkan elemen diagonal kedua ke variabel secondaryDiagonalSum
        $secondaryDiagonalSum += $matrix[$i][$n - $i - 1];
       
    }

   
    echo "Diagonal pertama: ";
    for ($i = 0; $i < $n; $i++) {
        echo $matrix[$i][$i] . " + ";
    }
    echo " = " . $primaryDiagonalSum . "\n";

    // Menampilkan penjumlahan diagonal kedua
    echo "Diagonal kedua: ";
    for ($i = 0; $i < $n; $i++) {
        echo $matrix[$i][$n - $i - 1] . " + ";
    }
    echo " = " . $secondaryDiagonalSum . "\n";
    
    // Mengembalikan hasil pengurangan antara jumlah diagonal utama dan kedua
    return "Maka Hasilnya adalah: ".$primaryDiagonalSum - $secondaryDiagonalSum;
}



// Result

$str = "NEGIE1";
echo "Reverse Alphabet: " . reverseAlphabet($str) . "\n";

$sentence = "Saya sangat senang mengerjakan soal algoritma.";
echo "Longest Word: " . longestWord($sentence) . "\n";


$inputArray = ['xc', 'dz', 'bbb', 'dz'];
$queryArray = ['bbb', 'ac', 'dz'];
$result = countOccurrencesInArray($inputArray, $queryArray);
echo "Kali Kata dalam QUERY Terdapat pada Array INPUT: ";
print_r($result);
echo "\n";

$matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]];
echo sumDiagonals($matrix) . "\n"; // Output: 3