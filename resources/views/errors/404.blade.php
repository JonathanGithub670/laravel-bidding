@extends('errors.layout')

@section('code', '404')
@section('title', 'Halaman Tidak Ditemukan')
@section('message', 'Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Periksa kembali URL atau kembali ke halaman utama.')

@section('actions')
    <a href="{{ url('/') }}" class="btn btn-primary">
        ← Kembali ke Beranda
    </a>
    <a href="{{ url('/auctions') }}" class="btn btn-secondary">
        Lihat Lelang
    </a>
@endsection