'use strict';
//Android O: 
//ARM32/64: _ZN3art7DexFile10OpenCommonEPKhjRKNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEjPKNS_10OatDexFileEbbPS9_PNS0_12VerifyResultE
//Android P:
//ARM32/64: _ZN3art13DexFileLoader10OpenCommonEPKhmS2_mRKNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEjPKNS_10OatDexFileEbbPS9_NS3_10unique_ptrINS_16DexFileContainerENS3_14default_deleteISH_EEEEPNS0_12VerifyResultE
//if u want to get own func name,u can use this script to get it!
var m =  Module.enumerateExportsSync('libart.so');
m.forEach(function(m){
	if(m.name.indexOf("OpenCommon") != -1){
	console.log("module name: "+ m.name);

};


});
console.log("=========================================");
console.log("Hook Start");
var OpenCommon = Module.findExportByName("libart.so","_ZN3art7DexFile10OpenCommonEPKhjRKNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEjPKNS_10OatDexFileEbbPS9_PNS0_12VerifyResultE");
if(OpenCommon != undefined){
	Interceptor.attach(OpenCommon,{
	onEnter: function(args){
		//console.log("base: "+ args[0]);
		console.log("base: "+ args[1]);
		console.log("size: "+ args[2].toInt32());
		console.log(hexdump(
			args[1],{
				offset: 0,
				length: 64,
				header: true,
				ansi: true


			}
			));
		var begin = args[1];
		console.log("magic : " + Memory.readUtf8String(begin))
		var address = parseInt(begin,16) + 0x20;
		var dex_size = Memory.readInt(ptr(address));
		console.log("dex_size :" + dex_size);
		var file = new File("/sdcard/" + dex_size + ".dex", "wb");
		file.write(Memory.readByteArray(begin, dex_size));
		file.flush();
		file.close();


	},
	onLeave: function(retval){
		console.log("Finished!!!");
		console.log("=========================================");
	}
});

}

