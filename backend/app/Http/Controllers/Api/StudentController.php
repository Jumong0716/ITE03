<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return Student::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname'      => 'required|string|max:255',
            'middlename'     => 'nullable|string|max:255',
            'lastname'       => 'required|string|max:255',
            'contact_number' => 'required|string',
            'course'         => 'required|string',
            'year'           => 'required',
        ]);

        return Student::create($validated);
    }

    public function show(Student $student)
    {
        return $student;
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'firstname'      => 'required|string|max:255',
            'middlename'     => 'nullable|string|max:255',
            'lastname'       => 'required|string|max:255',
            'contact_number' => 'required|string',
            'course'         => 'required|string',
            'year'           => 'required',
        ]);

        $student->update($validated);
        return $student;
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(['message' => 'Student deleted successfully']);
    }
}