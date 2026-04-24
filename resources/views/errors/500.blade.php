@extends('errors.layout')

@section('code', '500')
@section('title', 'Terjadi Kesalahan Server')
@section('message', 'Maaf, terjadi kesalahan pada server kami. Tim teknis telah diberitahu. Silakan coba lagi dalam beberapa saat.')

@section('actions')
    <button onclick="window.location.reload()" class="btn btn-primary">
        ↻ Coba Lagi
    </button>
    <a href="{{ url('/') }}" class="btn btn-secondary">
        ← Kembali ke Beranda
    </a>
@endsection