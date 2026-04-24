@extends('errors.layout')

@section('code', '429')
@section('title', 'Terlalu Banyak Permintaan')
@section('message', 'Anda telah mengirim terlalu banyak permintaan. Silakan tunggu sebentar sebelum mencoba lagi.')

@section('actions')
    <button onclick="window.location.reload()" class="btn btn-primary">
        ↻ Coba Lagi
    </button>
    <a href="{{ url('/') }}" class="btn btn-secondary">
        ← Kembali ke Beranda
    </a>
@endsection