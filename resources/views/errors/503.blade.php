@extends('errors.layout')

@section('code', '503')
@section('title', 'Sedang Dalam Pemeliharaan')
@section('message', 'Sistem sedang dalam pemeliharaan untuk peningkatan layanan. Silakan kembali lagi dalam beberapa menit.')

@section('actions')
    <button onclick="window.location.reload()" class="btn btn-primary">
        ↻ Coba Lagi
    </button>
@endsection