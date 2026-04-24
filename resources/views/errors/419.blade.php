@extends('errors.layout')

@section('code', '419')
@section('title', 'Sesi Telah Berakhir')
@section('message', 'Sesi login Anda telah kedaluwarsa. Silakan muat ulang halaman atau login kembali untuk melanjutkan.')

@section('actions')
    <a href="{{ url('/login') }}" class="btn btn-primary">
        🔑 Login Kembali
    </a>
    <button onclick="window.location.reload()" class="btn btn-secondary">
        ↻ Muat Ulang
    </button>
@endsection