@extends('errors.layout')

@section('code', '401')
@section('title', 'Tidak Terautentikasi')
@section('message', 'Anda perlu login terlebih dahulu untuk mengakses halaman ini.')

@section('actions')
    <a href="{{ url('/login') }}" class="btn btn-primary">
        🔑 Login
    </a>
    <a href="{{ url('/') }}" class="btn btn-secondary">
        ← Kembali ke Beranda
    </a>
@endsection