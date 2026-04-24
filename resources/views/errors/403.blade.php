@extends('errors.layout')

@section('code', '403')
@section('title', 'Akses Ditolak')
@section('message', 'Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator jika Anda merasa ini adalah kesalahan.')

@section('actions')
    <a href="{{ url('/') }}" class="btn btn-primary">
        ← Kembali ke Beranda
    </a>
    <a href="{{ url('/dashboard') }}" class="btn btn-secondary">
        Dashboard
    </a>
@endsection