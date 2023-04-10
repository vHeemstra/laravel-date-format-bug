<?php

namespace App\Http\Controllers;

use App\Models\Relationship;
use App\Http\Requests\StoreRelationshipRequest;
use App\Http\Requests\UpdateRelationshipRequest;

class RelationshipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRelationshipRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Relationship $relationship)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRelationshipRequest $request, Relationship $relationship)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Relationship $relationship)
    {
        //
    }
}
